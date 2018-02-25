
export default function debug (...args) {
  if (process.env.NODE_ENV !== 'production') {
    console.group('debug')
    args.forEach(val => console.log(val))
    console.groupEnd('debug')
  }
}
