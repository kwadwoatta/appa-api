import { DeliveryStatus, Point, WsEvents } from 'common';
import type { Delivery } from 'src/delivery';

export interface Event {
  [WsEvents.LocationChanged]: (payload: LocationChangedEvent) => void;
  [WsEvents.StatusChanged]: (payload: StatusChangedEvent) => void;
  [WsEvents.DeliveryUpdated]: (payload: DeliveryUpdatedEvent) => void;
}

export class LocationChangedEvent {
  event: WsEvents.LocationChanged;
  delivery_id: string;
  location: Point;
}

export class StatusChangedEvent {
  event: WsEvents.StatusChanged;
  delivery_id: string;
  status: DeliveryStatus;
}

export class DeliveryUpdatedEvent {
  event: WsEvents.StatusChanged;
  delivery_object: Delivery;
}

// import type { DeliveryStatus, Point, WsEvents } from 'common';
// import type { Delivery } from 'src/delivery';

// export type Event =
//   | LocationChangedEvent
//   | StatusChangedEvent
//   | DeliveryUpdatedEvent;

// export interface BaseEvent {
//   event: WsEvents;
//   delivery_id: string;
// }

// export interface LocationChangedEvent extends BaseEvent {
//   event: WsEvents.LocationChanged;
//   location: Point;
// }

// export interface StatusChangedEvent extends BaseEvent {
//   event: WsEvents.StatusChanged;
//   status: DeliveryStatus;
// }

// export interface DeliveryUpdatedEvent extends BaseEvent {
//   event: WsEvents.DeliveryUpdated;
//   delivery_object: Delivery;
// }

// //
// // import { DeliveryStatus, Point } from 'common';
