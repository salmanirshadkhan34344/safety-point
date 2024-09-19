// export class CreateWalletDto {}
// src/users/dto/create-user.dto.ts
export class CreateWalletDto {
    readonly email: string;
    readonly password?: string;
    readonly name: string;
    readonly wallet: string;
    readonly displayName: string;
    readonly avatar: string;
    readonly dob: Date;
    readonly address: string;
  }
  