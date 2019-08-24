import VehiclesContainer from '@/components/VehiclesContainer'
import GridLayout from '@/layouts/GridLayout'
import VehicleCard from '@/components/VehicleCard'
import NoData from '@/components/basic/NoData'
import { wrapperBuilderFactory } from '@tests/helpers/factoryHelpers'
import { AVAILABLE_VEHICLES } from '@/store/getters/getterTypes'
import { GET_VEHICLES, SHOW_MESSAGE } from '@/store/actions/actionTypes'
import MessageTypes from '@/constants/MessageTypes'
import {
  resolveAllPromises,
  actionToHaveBeenCalledWith,
  resolvedPromise,
  rejectedPromise
} from '@tests/helpers/testHelpers'

describe('VehiclesContainer.vue', () => {
  describe('when getting the vehicles', () => {
    it('should get the vehicles correctly', async () => {
      const getters = {
        AVAILABLE_VEHICLES: jest.fn(() => [])
      }
      const actions = {
        GET_VEHICLES: resolvedPromise()
      }

      vehiclesContainerBuilder().withGetters(getters).withActions(actions).build()

      await resolveAllPromises()
      expect(getters[AVAILABLE_VEHICLES]).toHaveBeenCalled()
      expect(actions[GET_VEHICLES]).toHaveBeenCalled()
    })

    it('should display an empty view when there are no vehicles', async () => {
      const getters = {
        AVAILABLE_VEHICLES: () => []
      }

      const wrapper = vehiclesContainerBuilder().withGetters(getters).build()

      expect(wrapper.contains(GridLayout)).toBe(false)
      expect(wrapper.contains(NoData)).toBe(false)
      await resolveAllPromises()
      expect(wrapper.contains(GridLayout)).toBe(false)
      expect(wrapper.contains(NoData)).toBe(true)
      expect(wrapper.find(NoData).props().message).toBe('No hay vehículos disponibles')
    })

    it('should display a grid of vehicles when there are vehicles', async () => {
      const givenVehicles = [
        givenAVehicle({ brand: 'firstBrand', model: 'firstModel', year: 2019, price: 9999, imageUrl: 'firstUrl' }),
        givenAVehicle({ brand: 'secondBrand', model: 'secondModel', year: 2019, price: 9999, imageUrl: 'secondUrl' }),
        givenAVehicle({ brand: 'thirdBrand', model: 'thirdModel', year: 2019, price: 9999, imageUrl: 'thirdUrl' })
      ]
      const getters = {
        AVAILABLE_VEHICLES: () => givenVehicles
      }

      const wrapper = vehiclesContainerBuilder().withGetters(getters).build()

      expect(wrapper.contains(GridLayout)).toBe(false)
      await resolveAllPromises()
      expect(wrapper.contains(NoData)).toBe(false)
      expect(wrapper.contains(GridLayout)).toBe(true)
      const expectedGrid = wrapper.find(GridLayout)
      const expectedVehicles = expectedGrid.findAll(VehicleCard)
      expect(expectedVehicles.length).toBe(3)
      verifyVehicleProps(expectedVehicles.at(0), givenVehicles[0])
      verifyVehicleProps(expectedVehicles.at(1), givenVehicles[1])
      verifyVehicleProps(expectedVehicles.at(2), givenVehicles[2])
    })

    it('should show an error message when it fails getting the vehicles', async () => {
      const actions = {
        GET_VEHICLES: rejectedPromise('anyError'),
        SHOW_MESSAGE: jest.fn()
      }

      vehiclesContainerBuilder().withActions(actions).build()

      await resolveAllPromises()
      actionToHaveBeenCalledWith(actions[SHOW_MESSAGE], {
        type: MessageTypes.ERROR,
        message: 'Ha ocurrido un error'
      })
    })
  })

  function vehiclesContainerBuilder () {
    const getters = {
      AVAILABLE_VEHICLES: () => []
    }
    const actions = {
      GET_VEHICLES: resolvedPromise(),
      SHOW_MESSAGE: jest.fn()
    }
    return wrapperBuilderFactory(VehiclesContainer).withGetters(getters).withActions(actions)
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
