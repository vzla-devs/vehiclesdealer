import { createLocalVue } from '@vue/test-utils'
import { createWrapperFactory } from '@/helpers/factoryHelpers'
import App from '@/App'
import VueRouter from 'vue-router'
import { HOME_ROUTE, VEHICLES_ROUTE } from '@/constants/routes'

describe ('App.vue', () => {
  const localVue = createLocalVue()
  localVue.use(VueRouter)

  it ('should render correctly', () => {
    const wrapper = factory().build()

    expect(wrapper.find('.home-link').text()).toBe('Inicio')
    expect(wrapper.find('.home-link').props().to).toBe(HOME_ROUTE)
    expect(wrapper.find('.vehicles-link').text()).toBe('Vehículos')
    expect(wrapper.find('.vehicles-link').props().to).toBe(VEHICLES_ROUTE)
    expect(wrapper.find('#content').exists()).toBe(true)
  })

  function factory () {
    return createWrapperFactory({ component: App, localVue })
  }
})