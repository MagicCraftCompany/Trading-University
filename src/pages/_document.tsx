// pages/_document.tsx file
import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import { ServerStyleSheet } from "styled-components";
import Script from "next/script";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />), //gets the styles from all the components inside <App>
        });
      
      const initialProps = await Document.getInitialProps(ctx);
      
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {/*👇 insert the collected styles to the html document*/}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
  
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // On page load or when changing themes, best to add inline in 'head' to avoid FOUC
                  if (localStorage.getItem('theme') === 'dark' || 
                     (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                })();
              `,
            }}
          />
          <Main />
          <NextScript />
          <Script src="/register-sw.js" strategy="afterInteractive" />
        </body>
      </Html>
    );
  }
}
