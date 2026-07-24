# Firefly Home

Firefly product and technical documentation website, built with VitePress.

## Local Development

```powershell
npm.cmd install
npm.cmd run dev
```

The local documentation site defaults to `http://127.0.0.1:5173/`.

## Build

```powershell
npm.cmd run build
npm.cmd run preview
```

## GitHub Pages

This project includes a GitHub Actions workflow in `.github/workflows/deploy.yml`.
Set the repository Pages source to **GitHub Actions**, then push to `main`.
