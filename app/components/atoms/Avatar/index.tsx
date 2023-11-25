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
      className="h-8 w-8 overflow-clip rounded-full ring-1 ring-neutral-100 ring-opacity-10 ring-offset-2 ring-offset-neutral-800"
    />
  )
}
