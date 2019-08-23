import { wrapperBuilderFactory } from '@tests/helpers/factoryHelpers'
import App from '@/App'
import ApplicationLayout from '@/layouts/ApplicationLayout'
import { HOME_ROUTE, VEHICLES_ROUTE } from '@/constants/routes'
import { ERROR_MESSAGE } from '@/store/getters/getterTypes'
import { CLEAR_MESSAGE, SHOW_MESSAGE } from '@/store/actions/actionTypes'
import VueRouter from 'vue-router'
import ExpectHelpers from '@tests/helpers/expectHelpers'
import MessageTypes from '@/enums/MessageTypes'

describe('App.vue', () => {
  const router = new VueRouter()
  let getters = {}
  let actions = {}

  beforeEach(() => {
    getters[ERROR_MESSAGE] = () => ({ show: false, message: '' })
    actions[SHOW_MESSAGE] = jest.fn()
    actions[CLEAR_MESSAGE] = jest.fn()
  })

  it('should render correctly', () => {
    const drawerOptions = [{ title: 'Inicio', event: 'onHomePage' }, { title: 'Vehículos', event: 'onVehiclesPage' }]

    const wrapper = wrapperBuilder().withData({ drawerOptions }).withRouter(router).withGetters(getters).withActions(actions).build()

    expect(wrapper.find(ApplicationLayout).props().drawerOptions).toBe(drawerOptions)
    expect(wrapper.find(ApplicationLayout).contains('#content'))
    expect(wrapper.find(ApplicationLayout).contains('.error-message'))
  })

  it('should not show an error message when there is no error', () => {
    getters[ERROR_MESSAGE] = () => ({ show: false, message: '' })
    const wrapper = wrapperBuilder().withRouter(router).withGetters(getters).withActions(actions).build()

    expect(wrapper.find('.error-message').exists()).toBe(false)
  })

  it('should show an error message when there is an error', () => {
    getters[ERROR_MESSAGE] = () => ({ show: true, message: 'anErrorMessage' })
    const wrapper = wrapperBuilder().withRouter(router).withGetters(getters).withActions(actions).build()

    wrapper.find('.error-message').vm.$emit('onClose')

    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').props().message).toBe('anErrorMessage')
  })

  it('should clear the error message when its corresponding close button is clicked', () => {
    getters[ERROR_MESSAGE] = () => ({ show: true, message: 'anErrorMessage' })
    const wrapper = wrapperBuilder().withRouter(router).withGetters(getters).withActions(actions).build()

    wrapper.find('.error-message').vm.$emit('onClose')

    ExpectHelpers().actionToHaveBeenCalledWith(actions[CLEAR_MESSAGE], MessageTypes.error)
  })

  it('should navigate to the home page when the corresponding option is clicked', () => {
    router.push = jest.fn()
    const wrapper = wrapperBuilder().withRouter(router).withGetters(getters).withActions(actions).build()

    wrapper.find(ApplicationLayout).vm.$emit('onHomePage')

    expect(router.push).toHaveBeenCalledWith(HOME_ROUTE)
  })

  it('should navigate to the vehicles page when the corresponding option is clicked', () => {
    router.push = jest.fn()
    const wrapper = wrapperBuilder().withRouter(router).withGetters(getters).withActions(actions).build()

    wrapper.find(ApplicationLayout).vm.$emit('onVehiclesPage')

    expect(router.push).toHaveBeenCalledWith(VEHICLES_ROUTE)
  })

  function wrapperBuilder () {
    return wrapperBuilderFactory(App)
  }
})
