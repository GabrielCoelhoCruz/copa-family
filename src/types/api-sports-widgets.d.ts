import 'react'

type ApiSportsWidgetAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> &
  Record<string, string | boolean | undefined>

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'api-sports-widget': ApiSportsWidgetAttributes
    }
  }
}

export {}
