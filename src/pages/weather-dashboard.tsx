import CurrentWeather from "@/components/current-weather";
import FavoriteCities from "@/components/favorite-cities";
import HourlyTemprature from "@/components/hourly-temprature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import WeatherDetails from "@/components/weather-details";
import WeatherForcast from "@/components/weather-forcast";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useForcasteQurery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather";
import {  AlertTriangle,  MapPin,  RefreshCcw } from "lucide-react";


const WeatherDashboard = () => {
  const {
    coordinates,
    error:errorLocation,
    isLoading:locationLoading,
    getLocation
  } = useGeolocation()

  const locationQuery = useReverseGeocodeQuery(coordinates);
  const forecastQuery = useForcasteQurery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);

  console.log('wet',weatherQuery.data)
  console.log('loc',locationQuery.data)
  console.log('for',forecastQuery.data)
 


  const handleRefresh = ()=>{
    getLocation();
    if(coordinates){
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();

    }

  };

  if(locationLoading){
    return <WeatherSkeleton/> 
  }

  if(errorLocation){
     return (
     <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Location Error.</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{errorLocation}</p>
          <Button onClick={getLocation} variant={'outline'} className="w-fit">
            <MapPin className="mr-2 h-4 w-4"/> 
            Enable Location.
          </Button>
        </AlertDescription>
      </Alert>
     )
  }

    if(!coordinates){
     return (
     <Alert variant="destructive">
        <AlertTitle>Location Required.</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather</p>
          <Button onClick={getLocation} variant={'outline'} className="w-fit">
            <MapPin className="mr-2 h-4 w-4"/> 
            Enable Location.
          </Button>
        </AlertDescription>
      </Alert>
     )
  }

  const locationName = locationQuery.data?.[0];

  if(weatherQuery.error || forecastQuery.error){
    return (
     <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Error.</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data.Please try again</p>
          <Button onClick={handleRefresh} variant={'outline'} className="w-fit">
            <RefreshCcw className="mr-2 h-4 w-4"/> 
            Retry
          </Button>
        </AlertDescription>
      </Alert>
     )
  }

  if(!weatherQuery.data || !forecastQuery.data){
    return <WeatherSkeleton/>
  }
  return (
    <div className="space-y-4">
      {/* favorite cities */}
      <FavoriteCities/>
      <div className="flex items-center justify-between ">
        <h1 className="text-xl font-bold tracking-tight">My location</h1>
        <Button variant={"outline"} 
        size={"icon"}
        onClick={handleRefresh}
        disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCcw className={`h-4 w-4 ${weatherQuery.isFetching?'animate-spin':''}`}/>
        </Button>
      </div>
      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather data={weatherQuery.data} locationName={locationName}/>
          <HourlyTemprature data={forecastQuery.data}/>
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data}/>
          <WeatherForcast data = {forecastQuery.data}/>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
