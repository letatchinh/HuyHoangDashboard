export default {
  flexGrow:1,
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },

  '&multiLine': {
    control: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      minHeight: 44,
      borderRadius:4,
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
      wordBreak: 'break-word',
    },
    input: {
      lightHeight:24,
      padding: 9,
      border: '1px solid silver',
      borderRadius:4,
      backgroundColor: '#f4f4f4'
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
      padding: 1,
      border: '1px solid #333',
      wordBreak: 'break-word',
    },
    input: {
      lightHeight:24,
      padding: 1,
      border: '2px inset',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
}
