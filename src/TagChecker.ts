interface Tag {
  name: string;
  position: number;
}

class TagChecker {
  private stack: Tag[] = [];
  
  public checkParagraph(paragraph: string): string {
    this.stack = [];
    const tokens = this.tokenize(paragraph);
    
    for (const token of tokens) {
      if (this.isOpeningTag(token)) {
        const tagName = this.extractTagName(token);
        this.stack.push({ name: tagName, position: 0 });
      } else if (this.isClosingTag(token)) {
        const tagName = this.extractTagName(token);
        
        if (this.stack.length === 0) {
          // No opening tag to match
          return `Expected # found </${tagName}>`;
        }
        
        const lastTag = this.stack[this.stack.length - 1];
        if (lastTag.name === tagName) {
          // Perfect match
          this.stack.pop();
        } else {
          // Wrong closing tag
          return `Expected </${lastTag.name}> found </${tagName}>`;
        }
      }
    }
    
    // Check for unmatched opening tags
    if (this.stack.length > 0) {
      const unmatchedTag = this.stack[this.stack.length - 1];
      return `Expected </${unmatchedTag.name}> found #`;
    }
    
    return "Correctly tagged paragraph";
  }
  
  private tokenize(text: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    
    while (i < text.length) {
      if (text[i] === '<') {
        const start = i;
        i++;
        
        // Find the closing >
        while (i < text.length && text[i] !== '>') {
          i++;
        }
        
        if (i < text.length) {
          i++; // Include the closing >
          tokens.push(text.substring(start, i));
        }
      } else {
        i++;
      }
    }
    
    return tokens;
  }
  
  private isOpeningTag(token: string): boolean {
    // Must be <X> where X is exactly one uppercase letter
    const match = token.match(/^<([A-Z])>$/);
    return match !== null;
  }
  
  private isClosingTag(token: string): boolean {
    // Must be </X> where X is exactly one uppercase letter
    const match = token.match(/^<\/([A-Z])>$/);
    return match !== null;
  }
  
  private extractTagName(token: string): string {
    const openMatch = token.match(/^<([A-Z])>$/);
    if (openMatch) {
      return openMatch[1];
    }
    
    const closeMatch = token.match(/^<\/([A-Z])>$/);
    if (closeMatch) {
      return closeMatch[1];
    }
    
    throw new Error(`Invalid tag: ${token}`);
  }
}

export default TagChecker;