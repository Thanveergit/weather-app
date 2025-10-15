import type { Coordinates } from "@/api/types";
import { weatherApi } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";


export const WEATHER_KEYS = {
     weather:(coord:Coordinates)=>['weather',coord] as const,
     forcast:(coord:Coordinates)=>['forcast',coord] as const,
     location:(coord:Coordinates)=>['location',coord] as const,
     search:(query:string)=>['location-search',query] as const,

} as const;

export function useWeatherQuery(coordinates:Coordinates | null){
     return useQuery({
          queryKey:WEATHER_KEYS.weather(coordinates??{lat:0,lon:0}),
          queryFn:()=>coordinates?weatherApi.getCurrentWeather(coordinates):null,
          enabled:!!coordinates
     })
}

export function useForcasteQurery(coordinates:Coordinates|null){
     return useQuery({
          queryKey:WEATHER_KEYS.forcast(coordinates??{lat:0,lon:0}),
          queryFn:()=>coordinates?weatherApi.getForcast(coordinates):null,
          enabled:!!coordinates
     })

}

export function useReverseGeocodeQuery(coordinates:Coordinates | null){
     return useQuery({
          queryKey:WEATHER_KEYS.location(coordinates??{lat:0,lon:0}),
          queryFn:()=>coordinates?weatherApi.reverseGeoCode(coordinates):null,
          enabled:!!coordinates 
     })
}

export function useLocationSearch(query:string){
     return useQuery({
          queryKey:WEATHER_KEYS.search(query),
          queryFn: ()=>weatherApi.searchLocation(query),
          enabled: query.length >= 3 
     })
}