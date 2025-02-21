# Figmable

Figmable is a CLI tool that helps you sync color variables from your Figma design files directly to your CSS files. It extracts color variables from Figma and automatically updates your CSS files with the new color variables, making the design-to-development workflow seamless.

## Features

- 🎨 Extract color variables from Figma files
- 🔄 Automatically sync with your CSS files
- 🔒 Preserve existing CSS variables
- 💾 Automatic backup of CSS files before updating
- 📦 Easy to integrate into your workflow

## Installation

```bash
npm install -g figmable
```

## Prerequisites

1. Figma API token - You can get this from your Figma account settings
2. Figma file key - This is the string of characters in your Figma file URL after `figma.com/file/`
3. CSS file where you want to update the color variables

## Usage

```bash
npx figmable -fileKey YOUR_FILE_KEY -token YOUR_API_TOKEN -path path/to/your/global.css
```

### Options

- `-fileKey` (required): Your Figma file key
- `-token` (required): Your Figma API token
- `-path` (required): Path to your CSS file
- `-output` (optional): Path to save the extracted Figma variables JSON (default: `./figma-variables.json`)
- `-h, --help`: Show help information

### Example

```bash
npx figmable \
  -fileKey abc123def456 \
  -token figd_YOUR_API_TOKEN \
  -path src/styles/global.css \
  -output ./figma-variables.json
```

## How It Works

1. Fetches color variables from your Figma file using the Figma API
2. Extracts variables that start with `--` (CSS variable syntax)
3. Converts Figma color values to hexadecimal format
4. Creates a backup of your existing CSS file
5. Updates your CSS file with the new color variables while preserving existing ones

## CSS File Requirements

Your CSS file should have a `:root` selector within a `@layer base` block where the variables will be inserted. For example:

```css
@layer base {
  :root {
    /* Your existing variables */
    --primary: #000000;
    /* New variables will be added here */
  }
}
```

## Notes

- The tool automatically creates a backup of your CSS file before making any changes (`.css.bak`)
- Only new variables will be added; existing variables will not be overwritten
- Color variables in Figma should be named with `--` prefix to be recognized as CSS variables

## Error Handling

- The tool will create necessary directories if they don't exist
- Appropriate error messages will be displayed if:
  - Figma API token is invalid
  - File paths are incorrect
  - JSON parsing fails
  - CSS file modification fails

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Byungsker
