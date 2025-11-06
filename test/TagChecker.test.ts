import TagChecker from "../src/TagChecker";

describe('TagChecker', () => {
  let tagChecker: TagChecker;

  beforeEach(() => {
    tagChecker = new TagChecker();
  });

  describe('Correctly tagged paragraphs', () => {
    test('should handle simple valid tags', () => {
      const input = '<B>This is bold text</B>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle nested tags', () => {
      const input = '<C><B>This is centered and bold</B></C>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle multiple separate tag pairs', () => {
      const input = '<B>Bold</B> and <I>Italic</I>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle complex nesting', () => {
      const input = '<A><B><C>Deep nesting</C></B></A>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle empty tags', () => {
      const input = '<B></B>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle text without any tags', () => {
      const input = 'This is plain text';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle sample input case 1', () => {
      const input = 'The following text<C><B>is centred and in boldface</B></C>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle sample input case 2 with invalid tags', () => {
      const input = '<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> <<d>sentence';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });
  });

  describe('Wrong nesting errors', () => {
    test('should detect wrong nesting order', () => {
      const input = '<B><C>Wrong nesting</B></C>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </C> found </B>');
    });

    test('should detect wrong nesting with sample input case 3', () => {
      const input = '<B><C> This should be centred and in boldface, but the tags are wrongly nested </B></C>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </C> found </B>');
    });

    test('should detect complex wrong nesting', () => {
      const input = '<A><B><C>Text</A></C></B>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </C> found </A>');
    });

    test('should detect immediate wrong closing tag', () => {
      const input = '<A></B>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </A> found </B>');
    });
  });

  describe('Extra closing tag errors', () => {
    test('should detect extra closing tag', () => {
      const input = '<B>Text</B></C>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected # found </C>');
    });

    test('should detect extra closing tag with sample input case 4', () => {
      const input = '<B>This should be in boldface, but there is an extra closing tag</B></C>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected # found </C>');
    });

    test('should detect multiple extra closing tags', () => {
      const input = '<B>Text</B></C></D>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected # found </C>');
    });

    test('should detect closing tag without any opening tag', () => {
      const input = 'Plain text</B>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected # found </B>');
    });
  });

  describe('Missing closing tag errors', () => {
    test('should detect missing closing tag', () => {
      const input = '<B>Text without closing';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </B> found #');
    });

    test('should detect missing closing tag with sample input case 5', () => {
      const input = '<B><C>This should be centred and in boldface, but there is a missing closing tag</C>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </B> found #');
    });

    test('should detect multiple missing closing tags', () => {
      const input = '<A><B><C>Text</C>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </B> found #');
    });

    test('should detect missing nested closing tag', () => {
      const input = '<A><B>Text</A>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </B> found </A>');
    });
  });

  describe('Invalid tag handling', () => {
    test('should ignore tags with lowercase letters', () => {
      const input = '<b>Should be ignored</b>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should ignore tags with multiple letters', () => {
      const input = '<BR>Should be ignored</BR>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should ignore tags with numbers', () => {
      const input = '<B1>Should be ignored</B1>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should ignore malformed tags', () => {
      const input = '<<B>>Text<</B>>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should ignore tags with special characters', () => {
      const input = '<\\g>Text<\\6>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should ignore incomplete tags', () => {
      const input = '<B Text without closing bracket';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle mixed valid and invalid tags', () => {
      const input = '<B>Valid</B> <invalid>Invalid</invalid> <C>Valid</C>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });
  });

  describe('Edge cases', () => {
    test('should handle empty string', () => {
      const input = '';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle whitespace only', () => {
      const input = '   \t\n  ';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle tags with whitespace around them', () => {
      const input = '  <B>  Text  </B>  ';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle single character content', () => {
      const input = '<A>x</A>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle all possible valid tag letters', () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (const letter of letters) {
        const input = `<${letter}>Text</${letter}>`;
        const result = tagChecker.checkParagraph(input);
        expect(result).toBe('Correctly tagged paragraph');
      }
    });

    test('should handle deeply nested tags', () => {
      const input = '<A><B><C><D><E><F>Deep</F></E></D></C></B></A>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });

    test('should handle tags at string boundaries', () => {
      const input = '<A>Start</A> middle <B>end</B>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Correctly tagged paragraph');
    });
  });

  describe('Complex error scenarios', () => {
    test('should return first error encountered in complex nesting', () => {
      const input = '<A><B><C></A></B></C>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </C> found </A>');
    });

    test('should handle multiple issues but report first one', () => {
      const input = '<A><B></A>'; // Wrong nesting, but also missing </B>
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </B> found </A>');
    });

    test('should handle interleaved valid and invalid structures', () => {
      const input = '<A>Valid</A> <B><C>Wrong</B></C>';
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </C> found </B>');
    });

    test('should prioritize wrong nesting over missing tags', () => {
      const input = '<A><B><C>Text</A>'; // Both wrong nesting and missing tags
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe('Expected </C> found </A>');
    });
  });

  describe('All sample test cases', () => {
    const sampleCases = [
      {
        input: 'The following text<C><B>is centred and in boldface</B></C>',
        expected: 'Correctly tagged paragraph'
      },
      {
        input: '<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> <<d>sentence',
        expected: 'Correctly tagged paragraph'
      },
      {
        input: '<B><C> This should be centred and in boldface, but the tags are wrongly nested </B></C>',
        expected: 'Expected </C> found </B>'
      },
      {
        input: '<B>This should be in boldface, but there is an extra closing tag</B></C>',
        expected: 'Expected # found </C>'
      },
      {
        input: '<B><C>This should be centred and in boldface, but there is a missing closing tag</C>',
        expected: 'Expected </B> found #'
      }
    ];

    test.each(sampleCases)('Sample case: $expected', ({ input, expected }) => {
      const result = tagChecker.checkParagraph(input);
      expect(result).toBe(expected);
    });
  });
});