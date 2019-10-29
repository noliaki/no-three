const UA: string = navigator.userAgent.toLocaleLowerCase()
const PI: number = Math.PI
const PI2: number = PI * 2

export function isPC(): boolean {
  return !/(iphone|ipad|ipod|android)/i.test(UA)
}

export function loadImage(
  src: string
): Promise<HTMLImageElement | HTMLCanvasElement> {
  return new Promise(
    (resolve: (image: HTMLImageElement | HTMLCanvasElement) => void): void => {
      const image: HTMLImageElement = new Image()
      image.width = 512
      image.height = 512

      image.addEventListener(
        'load',
        (): void => {
          const width: number = image.naturalWidth
          const height: number = image.naturalHeight
          const size: number = Math.pow(
            2,
            (Math.log(Math.min(width, height)) / Math.LN2) | 0
          )

          if (width !== height || width !== size) {
            const canvas: HTMLCanvasElement = document.createElement('canvas')
            canvas.width = size
            canvas.height = size
            ;(canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(
              image,
              0,
              0,
              width,
              height,
              0,
              0,
              size,
              size
            )

            return resolve(canvas)
          }

          resolve(image)
        },
        {
          once: true,
          passive: true
        }
      )

      image.src = src
    }
  )
}
