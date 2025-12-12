// global.d.ts

// ✅ Allow importing global CSS files
declare module "*.css";

// ✅ Allow importing CSS modules (*.module.css)
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// ✅ (Optional) SCSS support
declare module "*.scss";

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

// types/global.d.ts
declare module "@mypos-ltd/mypos";
