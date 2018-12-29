namespace Logger {
  let $log: any = null;

  export function init(): void {
    $log = document.getElementById('logger');
  }

  export function log(string: string): void {
    console.log(string);
    $log.innerHTML += '\n⇒ ' + string;
  }
}
