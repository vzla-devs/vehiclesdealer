import VehiclesView from '@/views/VehiclesView'
import VehiclesContainer from '@/components/VehiclesContainer'
import { createWrapperFactory } from '@/helpers/factoryHelpers'

describe ('VehiclesView.vue', () => {

  it ('should render correctly', () => {
    const wrapper = wrapperBuilder().build()

    expect(wrapper.find('.title').text()).toBe('Vehículos')
    expect(wrapper.find(VehiclesContainer).exists()).toBe(true)
  })

  function wrapperBuilder () {
    return createWrapperFactory({ component: VehiclesView })
  }
})