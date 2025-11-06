# TagChecker

A TypeScript implementation for validating HTML-like tag nesting and structure in text paragraphs.

## Overview

This program checks that all tags in a given piece of text are correctly nested and that there are no missing or extra tags. It follows the rules for markup languages where tags must be properly opened and closed.

## Tag Rules

- **Opening tags**: `<X>` where X is exactly one uppercase letter (A-Z)
- **Closing tags**: `</X>` where X matches the opening tag
- **Invalid tags**: Any tag not matching the above pattern is ignored

## Usage

### File Processing
```bash
npm start
```
Place `.txt` files in the `input/` directory. Results are written to `output/`.

### Single Paragraph Testing
```bash
npm run test-single -- "<B>Your test paragraph here</B>"
```

### Development
```bash
npm run dev          # Run with auto-restart
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
```

## Expected Output

- **Valid**: `Correctly tagged paragraph`
- **Wrong nesting**: `Expected </expected> found </unexpected>`
- **Extra closing tag**: `Expected # found </tag>`
- **Missing closing tag**: `Expected </tag> found #`

## Examples

| Input | Output |
|-------|--------|
| `<B>Bold text</B>` | `Correctly tagged paragraph` |
| `<B><C>Wrong nesting</B></C>` | `Expected </C> found </B>` |
| `<B>Extra closing</B></C>` | `Expected # found </C>` |
| `<B>Missing closing` | `Expected </B> found #` |

## Installation

```bash
npm install
```

## Testing

The project includes comprehensive unit tests covering all edge cases and error scenarios.

```bash
npm test
```