import VehiclesContainer from '@/components/VehiclesContainer.vue'
import GridLayout from '@/layouts/GridLayout.vue'
import VehicleCard from '@/components/VehicleCard.vue'
import NoData from '@/components/basic/NoData.vue'
import { componentBuilder } from '@tests/helpers/builderHelpers'
import { AVAILABLE_VEHICLES } from '@/store/getters/getterTypes'
import { GET_VEHICLES, SHOW_MESSAGE } from '@/store/actions/actionTypes'
import { MESSAGE_TYPES } from '@/constants/enums'
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
        GET_VEHICLES: jest.fn(() => resolvedPromise())
      }

      aVehiclesContainer().withGetters(getters).withActions(actions).build()

      await resolveAllPromises()
      expect(getters[AVAILABLE_VEHICLES]).toHaveBeenCalled()
      expect(actions[GET_VEHICLES]).toHaveBeenCalled()
    })

    it('should display an empty view when there are no vehicles', async () => {
      const getters = {
        AVAILABLE_VEHICLES: () => []
      }

      const wrapper = aVehiclesContainer().withGetters(getters).build()

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

      const wrapper = aVehiclesContainer().withGetters(getters).build()

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
        GET_VEHICLES: jest.fn(() => rejectedPromise('anyError')),
        SHOW_MESSAGE: jest.fn()
      }

      aVehiclesContainer().withActions(actions).build()

      await resolveAllPromises()
      actionToHaveBeenCalledWith(actions[SHOW_MESSAGE], {
        type: MESSAGE_TYPES.ERROR,
        message: 'Ha ocurrido un error'
      })
    })
  })

  function aVehiclesContainer () {
    const getters = {
      AVAILABLE_VEHICLES: () => []
    }
    const actions = {
      GET_VEHICLES: () => resolvedPromise(),
      SHOW_MESSAGE: () => {}
    }
    return componentBuilder(VehiclesContainer).withGetters(getters).withActions(actions)
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
