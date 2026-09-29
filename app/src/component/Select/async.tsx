import { FunctionComponent } from 'react'

import Animate from 'react-select/animated'
import AsyncSelect from 'react-select/async'

type SelectAsyncProps = {
  multi?: boolean
  options: (search: string) => Promise<
    {
      value: string
      label: string
    }[]
  >
}

const animate = Animate()

export const SelectAsync: FunctionComponent<SelectAsyncProps> = ({
  multi = false,
  options,
  ...props
}: SelectAsyncProps) => {
  return (
    <AsyncSelect
      {...props}
      isMulti={multi}
      components={animate}
      loadOptions={options}
    />
  )
}
