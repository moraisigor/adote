export const url = (image?: string) => {
  if (image) {
    return `${process.env.STORAGE_PUBLIC}/${image}`
  }
}
