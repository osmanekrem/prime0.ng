import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExtendedUser } from "@/next-auth";

export default function UserAvatar({
  user,
  size = 32,
}: {
  user?: ExtendedUser;
  size?: number;
}) {
  if (!user) {
    return (
      <Avatar
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
        }}
        className="rounded-full text-primary bg-primary-foreground border border-primary/25"
      >
        <AvatarFallback className="rounded-full">U</AvatarFallback>
      </Avatar>
    );
  }

  const avatarFallback =
    user.name?.charAt(0).toUpperCase() +
      (user.surname?.charAt(0).toUpperCase() || "") || "U";
  return (
    <Avatar
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
      className=" rounded-full text-primary bg-primary-foreground border border-primary/25"
    >
      <AvatarImage
        src={user.image ?? undefined}
        alt={user.name ?? `User avatar`}
        className="rounded-full"
      />
      <AvatarFallback className="rounded-full">{avatarFallback}</AvatarFallback>
    </Avatar>
  );
}
