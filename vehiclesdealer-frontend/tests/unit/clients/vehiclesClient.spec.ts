import vehiclesClient from '@/clients/vehiclesClient'
import { mockedRestClient } from '@tests/helpers/testHelpers'
import { BASE_URL } from '@/constants/serverRoutes'
import { TestValues } from '@tests/helpers/testValues'

describe('vehiclesClient.js', () => {
  it('gets all the vehicles', () => {
    const vehicles = [
      TestValues.vehicle('1', 'audi'),
      TestValues.vehicle('2', 'volkswagen')
    ]
    const restClient = mockedRestClient(vehicles)

    const result = vehiclesClient(restClient).get()

    expect(restClient.get).toHaveBeenCalledWith(`${BASE_URL}/vehicles`)
    expect(result).toBe(vehicles)
  })
})