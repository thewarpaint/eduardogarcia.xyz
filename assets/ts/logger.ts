class Logger {
  private $log: any = null;

  constructor() {}

  public init(): void {
    this.$log = document.getElementById('logger');
  }

  public log(string: string): void {
    console.log(string);
    this.$log.innerHTML += '\n⇒ ' + string;
  }
}
