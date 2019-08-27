import VehiclesPage from '@/pages/VehiclesPage.vue'
import VehiclesContainer from '@/components/VehiclesContainer.vue'
import { componentBuilder } from '@tests/helpers/builderHelpers'

describe('VehiclesPage.vue', () => {
  it('renders correctly', () => {
    const wrapper = aVehiclesPage().build()

    expect(wrapper.find('h1').text()).toBe('Vehículos')
    expect(wrapper.find(VehiclesContainer).exists()).toBe(true)
  })

  function aVehiclesPage () {
    return componentBuilder(VehiclesPage)
  }
})
