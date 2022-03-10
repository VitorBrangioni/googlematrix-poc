import { Client, LatLng, TravelMode, UnitSystem, DistanceMatrixResponseData } from "@googlemaps/google-maps-services-js";
import { partnersLatLong, solicitationOrigin, solicitationDestiny } from "./mocks";

const client = new Client({});

interface IElementMerge {
  distanceA: number;
  distanceB: number;
  durationA: number;
  durationB: number;
  sumDistance: number;
  sumDuration: number;
}

const distancematrix = (origins: LatLng[], destinations: LatLng[]) : Promise<DistanceMatrixResponseData> => {
  return client.distancematrix({
    params: {
      origins,
      destinations,
      mode: TravelMode.driving,
      units: UnitSystem.imperial,
      key:''
    }
  }).then(res => res.data);
}

(async () => {

  const matrixA = await distancematrix(partnersLatLong, [solicitationOrigin]);
  const matrixB = await distancematrix([solicitationDestiny], partnersLatLong);

  const elementsA = matrixA.rows;
  const elementsB = matrixB.rows[0].elements;

  let elementsMerged: IElementMerge[] = [];


  if (elementsA.length !== elementsB.length)
    return console.log('Anything is wrong');

  for (let i = 0; i < elementsA.length; i++) {
    const elementA = elementsA[i];
    const elementB = elementsB[i];

    elementsMerged.push({
      distanceA: elementA.elements[0].distance.value,
      distanceB: elementB.distance.value,
      durationA: elementA.elements[0].duration.value,
      durationB: elementB.duration.value,
      sumDistance: elementA.elements[0].distance.value + elementB.distance.value,
      sumDuration: elementA.elements[0].duration.value + elementB.duration.value,
    });
  }

  elementsMerged = elementsMerged.sort((a, b) => a.sumDuration - b.sumDuration)

  console.log(JSON.stringify(elementsMerged));

})();