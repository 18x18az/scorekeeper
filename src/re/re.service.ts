import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

const BASE_URL = 'https://www.robotevents.com/api/v2'

interface Response<T> {
  meta: {
    current_page: number
  }
  data: T[]
}

@Injectable()
export class ReService {
  private readonly API_KEY = process.env.RE_API_KEY as string

  private readonly config = {
    headers: {
      Authorization: `Bearer ${this.API_KEY}`
    }
  }

  constructor (private readonly http: HttpService) {}

  async paginated<T>(resource: string, params?: Object): Promise<T[]> {
    const url = `${BASE_URL}/${resource}`
    const config = { ...this.config, params }
    const observable = this.http.get<T>(
      url,
      config
    )
    const response = (await firstValueFrom(observable)).data as Response<T>
    return response.data
  }

  async single<T>(resource: string, id: number): Promise<T> {
    const url = `${BASE_URL}/${resource}/${id}`
    const config = { ...this.config }
    const observable = this.http.get<T>(
      url,
      config
    )
    const response = (await firstValueFrom(observable)).data
    return response
  }
}
