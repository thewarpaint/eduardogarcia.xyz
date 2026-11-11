// Generates _includes/americas-map.svg for /americas from Natural Earth's
// 1:50m countries (via the world-atlas package), with one <path> per country
// or territory, tagged with its ISO 3166-1 alpha-2 code in data-country.
//
// Usage, from this directory:
//
//   npm install
//   npm run generate

const fs = require('fs');
const path = require('path');
const d3 = require('d3-geo');
const topojson = require('topojson-client');
const { presimplify, simplify } = require('topojson-simplify');
const world = require('world-atlas/countries-50m.json');

const OUTPUT = path.join(__dirname, '../../_includes/americas-map.svg');

const WIDTH = 1000;
// Minimum triangle area to keep a point, in square degrees
const SIMPLIFICATION = 0.01;
// Countries smaller than this, in square pixels, also get a circle marker so
// they can be seen and tapped
const MARKER_AREA = 40;
const MARKER_RADIUS = 5;

// Natural Earth name -> ISO 3166-1 alpha-2
const AMERICAS = {
  'Anguilla': 'AI',
  'Antigua and Barb.': 'AG',
  'Argentina': 'AR',
  'Aruba': 'AW',
  'Bahamas': 'BS',
  'Barbados': 'BB',
  'Belize': 'BZ',
  'Bermuda': 'BM',
  'Bolivia': 'BO',
  'Brazil': 'BR',
  'British Virgin Is.': 'VG',
  'Canada': 'CA',
  'Cayman Is.': 'KY',
  'Chile': 'CL',
  'Colombia': 'CO',
  'Costa Rica': 'CR',
  'Cuba': 'CU',
  'Curaçao': 'CW',
  'Dominica': 'DM',
  'Dominican Rep.': 'DO',
  'Ecuador': 'EC',
  'El Salvador': 'SV',
  'Falkland Is.': 'FK',
  'Greenland': 'GL',
  'Grenada': 'GD',
  'Guatemala': 'GT',
  'Guyana': 'GY',
  'Haiti': 'HT',
  'Honduras': 'HN',
  'Jamaica': 'JM',
  'Mexico': 'MX',
  'Montserrat': 'MS',
  'Nicaragua': 'NI',
  'Panama': 'PA',
  'Paraguay': 'PY',
  'Peru': 'PE',
  'Puerto Rico': 'PR',
  'Saint Lucia': 'LC',
  'Sint Maarten': 'SX',
  'St-Barthélemy': 'BL',
  'St-Martin': 'MF',
  'St. Kitts and Nevis': 'KN',
  'St. Pierre and Miquelon': 'PM',
  'St. Vin. and Gren.': 'VC',
  'Suriname': 'SR',
  'Trinidad and Tobago': 'TT',
  'Turks and Caicos Is.': 'TC',
  'U.S. Virgin Is.': 'VI',
  'United States of America': 'US',
  'Uruguay': 'UY',
  'Venezuela': 'VE',
};

const IBERIA = {
  'Andorra': 'AD',
  'Portugal': 'PT',
  'Spain': 'ES',
};

// Drawn in the Iberian Peninsula inset for context only
const IBERIA_CONTEXT = ['France', 'Morocco', 'Algeria', 'Italy', 'Switzerland', 'Gibraltar'];

function polygons(geometry) {
  return geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
}

function multiPolygon(coordinates) {
  return { type: 'MultiPolygon', coordinates: coordinates };
}

function centroid(polygon) {
  return d3.geoCentroid({ type: 'Polygon', coordinates: polygon });
}

function inBox(polygon, west, east, south, north) {
  const [longitude, latitude] = centroid(polygon);

  return longitude >= west && longitude <= east && latitude >= south && latitude <= north;
}

// Natural Earth bundles overseas territories with their country, so split
// out the American ones
function split(features) {
  const result = {};

  features.forEach(function (feature) {
    const name = feature.properties.name;
    const parts = polygons(feature.geometry);

    if (name === 'France') {
      result.GF = multiPolygon(parts.filter((p) => inBox(p, -55, -51, 2, 6)));
      result.MQ = multiPolygon(parts.filter((p) => inBox(p, -61.3, -60.7, 14.3, 15)));
      result.GP = multiPolygon(parts.filter((p) => inBox(p, -62, -61, 15.7, 16.6)));
      result.FR = multiPolygon(parts.filter((p) => centroid(p)[0] > -10 && centroid(p)[1] > 35));
    } else if (name === 'Netherlands') {
      result.BQ = multiPolygon(parts.filter((p) => centroid(p)[0] < -30));
    } else if (name === 'United States of America') {
      // Hawaii is in Oceania
      result.US = multiPolygon(parts.filter((p) => !inBox(p, -161, -154, 18, 23)));
    } else if (AMERICAS[name] || IBERIA[name]) {
      result[AMERICAS[name] || IBERIA[name]] = feature.geometry;
    } else if (IBERIA_CONTEXT.includes(name)) {
      result['context-' + name] = feature.geometry;
    }
  });

  return result;
}

function round(pathString) {
  return pathString.replace(/-?\d+\.\d+/g, (number) => (+number).toFixed(1).replace(/\.0$/, ''));
}

function main() {
  const simplified = simplify(presimplify(world), SIMPLIFICATION);
  const geometries = split(topojson.feature(simplified, simplified.objects.countries).features);
  // Simplifying can make the smallest islands disappear, so those keep
  // their full detail
  const fullGeometries = split(topojson.feature(world, world.objects.countries).features);

  const americanCodes = Object.keys(geometries).filter((code) => /^[A-Z]{2}$/.test(code) && !Object.values(IBERIA).includes(code) && code !== 'FR');

  // Fit to the Americas without the far western Aleutians, which would leave a
  // lot of empty ocean
  const fitTo = {
    type: 'FeatureCollection',
    features: americanCodes.map((code) => ({
      type: 'Feature',
      geometry: code === 'US'
        ? multiPolygon(geometries.US.coordinates.filter((p) => centroid(p)[0] > -170))
        : geometries[code],
    })),
  };

  const projection = d3.geoAzimuthalEqualArea().rotate([82, -12]);
  projection.fitWidth(WIDTH - 20, fitTo);
  projection.translate([projection.translate()[0] + 10, projection.translate()[1] + 10]);

  const geoPath = d3.geoPath(projection);
  const bounds = geoPath.bounds(fitTo);
  const height = Math.ceil(bounds[1][1] + 10);

  Object.keys(geometries).forEach(function (code) {
    if (!geoPath(geometries[code]) || geoPath.area(geometries[code]) < MARKER_AREA) {
      geometries[code] = fullGeometries[code];
    }
  });

  // Iberian Peninsula inset, in the empty Pacific west of South America
  const inset = { x: 20, y: 940, width: 400, height: 300 };
  const iberiaProjection = d3.geoConicConformal().parallels([36, 44]).rotate([3.5, 0]);
  iberiaProjection.fitExtent(
    [[inset.x + 12, inset.y + 30], [inset.x + inset.width - 12, inset.y + inset.height - 12]],
    // The peninsula, without the Canary Islands, Azores and Madeira
    { type: 'MultiPoint', coordinates: [[-9.6, 35.9], [3.4, 35.9], [-9.6, 43.9], [3.4, 43.9]] }
  );
  const iberiaPath = d3.geoPath(iberiaProjection);

  const lines = [];
  const markers = [];

  lines.push('<svg class="map" viewBox="0 0 ' + WIDTH + ' ' + height + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="map-title">');
  lines.push('  <title id="map-title"></title>');
  lines.push('  <defs>');
  lines.push('    <clipPath id="inset-clip"><rect x="' + inset.x + '" y="' + inset.y + '" width="' + inset.width + '" height="' + inset.height + '" rx="12"/></clipPath>');
  lines.push('  </defs>');
  lines.push('  <g class="countries">');

  americanCodes.sort().forEach(function (code) {
    const d = geoPath(geometries[code]);

    if (!d) {
      return;
    }

    lines.push('    <path class="country" data-country="' + code + '" d="' + round(d) + '"/>');

    if (geoPath.area(geometries[code]) < MARKER_AREA) {
      const [x, y] = geoPath.centroid(geometries[code]);

      markers.push('    <circle class="country country--marker" data-country="' + code + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + MARKER_RADIUS + '"/>');
    }
  });

  lines.push('  </g>');
  lines.push('  <g class="markers">');
  lines.push.apply(lines, markers);
  lines.push('  </g>');
  lines.push('  <g class="inset">');
  lines.push('    <rect class="inset__background" x="' + inset.x + '" y="' + inset.y + '" width="' + inset.width + '" height="' + inset.height + '" rx="12"/>');
  lines.push('    <g clip-path="url(#inset-clip)">');

  Object.keys(geometries).filter((key) => key.indexOf('context-') === 0).forEach(function (key) {
    lines.push('      <path class="context" d="' + round(iberiaPath(geometries[key])) + '"/>');
  });

  lines.push('      <path class="context" d="' + round(iberiaPath(geometries.FR)) + '"/>');

  Object.values(IBERIA).forEach(function (code) {
    lines.push('      <path class="country" data-country="' + code + '" d="' + round(iberiaPath(geometries[code])) + '"/>');
  });

  const [andorraX, andorraY] = iberiaPath.centroid(geometries.AD);

  lines.push('      <circle class="country country--marker" data-country="AD" cx="' + andorraX.toFixed(1) + '" cy="' + andorraY.toFixed(1) + '" r="' + MARKER_RADIUS + '"/>');
  lines.push('    </g>');
  lines.push('    <rect class="inset__border" x="' + inset.x + '" y="' + inset.y + '" width="' + inset.width + '" height="' + inset.height + '" rx="12"/>');
  lines.push('    <text class="inset__label" x="' + (inset.x + 14) + '" y="' + (inset.y + 24) + '"></text>');
  lines.push('  </g>');
  lines.push('</svg>');

  fs.writeFileSync(OUTPUT, lines.join('\n') + '\n');
  console.log('Wrote ' + OUTPUT + ' (' + Math.round(fs.statSync(OUTPUT).size / 1024) + ' KB, ' + WIDTH + 'x' + height + ')');
}

main();
