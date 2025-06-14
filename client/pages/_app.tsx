import { AppProps } from "next/app";
import "@radix-ui/themes/styles.css";
import "../src/App.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
