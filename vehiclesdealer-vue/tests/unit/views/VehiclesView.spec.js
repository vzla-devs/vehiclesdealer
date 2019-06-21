import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { GET_VEHICLES } from '@/store/getters/gettersTypes'
import VehiclesView from '@/views/VehiclesView'
import GridLayout from '@/components/basic/GridLayout'
import VehicleCard from '@/components/VehicleCard'

describe('VehiclesView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  
  test('display an empty view when there are no vehicles', () => {
    const givenVehicles = []

    const vehiclesView = AVehiclesView().withVehicles(givenVehicles).build()

    expect(vehiclesView.contains(GridLayout)).toBe(false)
    expect(vehiclesView.contains('#no-vehicles')).toBe(true)
    expect(vehiclesView.find('#no-vehicles').text()).toBe('No hay vehículos disponibles')
  })

  test('display a grid of vehicles', () => {
    const givenVehicles = [givenAVehicle(), givenAVehicle(), givenAVehicle()]

    const vehiclesView = AVehiclesView().withVehicles(givenVehicles).build()

    expect(vehiclesView.contains(GridLayout)).toBe(true)
    const expectedGrid = vehiclesView.find(GridLayout)
    expect(expectedGrid.findAll(VehicleCard).length).toBe(3)
    expect(vehiclesView.contains('#no-vehicles')).toBe(false)
  })

  test('display a grid of vehicles with their corresponding props', () => {
    const givenVehicles = [
      givenAVehicle({ brand: 'firstBrand', model: 'firstModel', year: 2019, price: 9999, imageUrl: 'firstUrl' }),
      givenAVehicle({ brand: 'secondBrand', model: 'secondModel', year:  2019, price: 9999, imageUrl: 'secondUrl' }),
      givenAVehicle({ brand: 'thirdBrand', model: 'thirdModel', year: 2019, price: 9999, imageUrl: 'thirdUrl' })
    ]

    const vehiclesView = AVehiclesView().withVehicles(givenVehicles).build()

    const expectedVehicles = vehiclesView.findAll(VehicleCard)
    verifyVehicleProps(expectedVehicles.at(0), givenVehicles[0])
    verifyVehicleProps(expectedVehicles.at(1), givenVehicles[1])
    verifyVehicleProps(expectedVehicles.at(2), givenVehicles[2])
  })

  function AVehiclesView () {
    let vehicles = []
    const getters = {
      [GET_VEHICLES]: () => vehicles
    }
    let wrapper

    function withVehicles (newVehicles) {
      vehicles = newVehicles
      return self
    }

    function build () {
      const store = new Vuex.Store({ getters })
      wrapper = shallowMount(VehiclesView, { store, localVue })
      return self
    }

    const self = {
      withVehicles,
      build,
      find: (element) => wrapper.find(element),
      findAll: (element) => wrapper.findAll(element),
      contains: (element) => wrapper.contains(element)
    }
    return self
  }

  function givenAVehicle ({ brand = 'anyBrand', model = 'anyModel', year = 0, price = 0, imageUrl = 'anyUrl' } = {}) {
    return { brand, model, year, price, imageUrl }
  }

  function verifyVehicleProps (vehicleToVerify, expectedVehicle) {
    expect(vehicleToVerify.props()).toEqual({
      brand: expectedVehicle.brand,
      model: expectedVehicle.model,
      year: expectedVehicle.year,
      price: expectedVehicle.price,
      imageUrl: expectedVehicle.imageUrl
    })
  }
})