export default function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter((c) => typeof c === 'string').join(' ')
}
