# Figmable

English | [한국어](.docs/README.ko.md)

Figmable is a CLI tool that helps you sync color variables from your Figma design files directly to your CSS files. It extracts color variables from Figma and automatically updates your CSS files with the new color variables, making the design-to-development workflow seamless.

## Features

- 🎨 Extract color variables from Figma files
- 🔄 Automatically sync with your CSS files
- 🔒 Preserve existing CSS variables
- 💾 Automatic backup of CSS files before updating
- 📦 Easy to integrate into your workflow
- ⚡️ Simple configuration management

## Prerequisites

1. **Figma API Token**

   - Go to Figma > Account Settings > Access tokens
   - Create a new access token
   - Copy the token for later use

2. **Figma File Key**

   - Open your Figma file in browser
   - Copy the key from URL: `figma.com/file/YOUR_FILE_KEY/...`

3. **CSS File**
   - Must have `@layer base` and `:root` structure
   - Example:
     ```css
     @layer base {
       :root {
         /* Your CSS variables will be added here */
         --primary: #000000;
       }
     }
     ```

## Installation

```bash
npm install -g figmable
```

## Usage

### 1. Save Configuration

First, save your Figma credentials and file paths:

```bash
figmable config \
  --fileKey YOUR_FIGMA_FILE_KEY \
  --token YOUR_FIGMA_API_TOKEN \
  --path ./path/to/your/global.css
```

### 2. View Current Configuration

Check your saved configuration:

```bash
figmable show
```

This will display:

- Figma file key and URL
- API token
- File paths
- Configuration file location (which you can edit directly)

### 3. Sync Variables

After configuration, simply run:

```bash
figmable
```

This will:

1. Fetch color variables from your Figma file
2. Save them to `figma-variables.json`
3. Update your CSS file
4. Create a backup of your CSS file (`.bak`)

### Advanced Usage

Override configuration for a single run:

```bash
figmable \
  --fileKey DIFFERENT_KEY \
  --token DIFFERENT_TOKEN \
  --path ./different/path.css \
  --output ./different/variables.json
```

## File Structure

- `.figmablerc`: Configuration file (automatically created in home directory)
- `figma-variables.json`: Extracted Figma variables (created in project directory)
- `your-css-file.css.bak`: Backup file (created alongside CSS file)

## Error Handling

Figmable provides clear error messages for common issues:

- Invalid Figma API token
- File access permissions
- Missing or invalid file paths
- JSON parsing errors
- CSS file modification errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Byungsker
