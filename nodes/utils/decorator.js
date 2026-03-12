class Decorator{
  static drawLine(){
    console.log("=".repeat(30));
  }

  static presentMenu(welcome){
    this.drawLine();
    console.log('\n');
    console.log(`${welcome}`);
    this.drawLine();
  }
}
module.exports = Decorator;