interface Tag {
  name: string;
  position: number;
}

class TagChecker {
  private readonly openingTagPattern: RegExp = /^<([A-Z])>$/;
  private readonly closingTagPattern: RegExp = /^<\/([A-Z])>$/;
  
  public checkParagraph(paragraph: string): string {
    const stack: Tag[] = [];
    const tokens = this.tokenize(paragraph);
    
    for (const token of tokens) {
      if (this.isOpeningTag(token)) {
        const tagName = this.extractTagName(token);
        stack.push({ name: tagName, position: 0 });
        continue;
      } 
        
      if (this.isClosingTag(token)) {
        const tagName = this.extractTagName(token);
        
        if (stack.length === 0) {
          // No opening tag to match
          return `Expected # found </${tagName}>`;
        }
        
        const lastTag = stack[stack.length - 1];
        if (lastTag.name === tagName) {
          // Perfect match
          stack.pop();
          continue;
        }
      
        // Wrong closing tag
        return `Expected </${lastTag.name}> found </${tagName}>`;
      }
    }
    
    // Check for unmatched opening tags
    if (stack.length > 0) {
      const unmatchedTag = stack[stack.length - 1];
      return `Expected </${unmatchedTag.name}> found #`;
    }
    
    return "Correctly tagged paragraph";
  }
  
  private tokenize(text: string): string[] {
    // Match all tags: < followed by any content until >
    const tagRegex = /<[^>]*>/g;
    return text.match(tagRegex) || [];
  }
  
  private isOpeningTag(token: string): boolean {
    // Must be <X> where X is exactly one uppercase letter
    return this.openingTagPattern.test(token);
  }
  
  private isClosingTag(token: string): boolean {
    // Must be </X> where X is exactly one uppercase letter
    return this.closingTagPattern.test(token);
  }
  
  private extractTagName(token: string): string {
    const openMatch = this.openingTagPattern.exec(token);
    if (openMatch) {
      return openMatch[1];
    }

    const closeMatch = this.closingTagPattern.exec(token);
    if (closeMatch) {
      return closeMatch[1];
    }
    
    throw new Error(`Invalid tag: ${token}`);
  }
}

export default TagChecker;