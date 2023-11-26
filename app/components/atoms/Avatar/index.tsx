import userIcon from 'assets/user.svg'

type AvatarProps = {
  name: string
  image: string | null
}
export default function Avatar({ name, image }: AvatarProps) {
  return (
    <img
      alt={name}
      src={image ?? userIcon}
      className="ring-mauve-a6 ring-offset-mauve-2 h-8 w-8 overflow-clip rounded-full ring-1 ring-offset-2"
    />
  )
}
