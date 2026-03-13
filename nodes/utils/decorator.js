class Decorator {
  static drawLine(length = 30) {
    console.log("=".repeat(length));
  }

  static drawDoubleLine(length = 30) {
    console.log("=".repeat(length));
    console.log("=".repeat(length));
  }

  static presentMenu(welcome) {
    this.drawDoubleLine();
    console.log(`\n   ${welcome}\n`);
    this.drawDoubleLine();
  }

  static noteHeader(note) {
    this.drawLine();
    console.log(`   📝 ${note.title}`);
    this.drawLine();
  }

  static infoMessage(message, type = 'info') {
    const symbols = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    const symbol = symbols[type] || symbols.info;
    console.log(`\n${symbol} ${message}\n`);
  }

  static contentBox(content) {
    console.log("┌" + "─".repeat(28) + "┐");
    const lines = content.split('\n');
    lines.forEach(line => {
      const paddedLine = line.padEnd(28);
      console.log(`│ ${paddedLine} │`);
    });
    console.log("└" + "─".repeat(28) + "┘");
  }

  static showMenu(items) {
    console.log('\n');
    this.drawLine();
    console.log('   ГЛАВНОЕ МЕНЮ');
    this.drawLine();
    items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item}`);
    });
    this.drawLine();
  }
}

module.exports = Decorator;