export class ImageResponse {
  constructor(
    readonly key: string,
    readonly url: string,
    readonly header: { [key: string]: string }
  ) {}
}
