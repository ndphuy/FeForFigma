// Bounding boxes & centers sourced from Mapbox's own place-level geocoding data
// (post-2025 provincial merger boundaries), used to restrict address search
// results to a single city/province.
export const VIETNAM_CITIES = [
  {
    id: 'hcm',
    name: 'TP. Hồ Chí Minh',
    center: [106.702105, 10.775525],
    bbox: [106.326896, 8.531201, 107.629978, 11.50104],
  },
  {
    id: 'hanoi',
    name: 'Hà Nội',
    center: [105.854041, 21.028333],
    bbox: [105.285359, 20.564731, 106.020128, 21.385389],
  },
  {
    id: 'danang',
    name: 'Đà Nẵng',
    center: [108.212, 16.068],
    bbox: [107.210525, 14.951316, 108.788112, 16.243475],
  },
  {
    id: 'cantho',
    name: 'Cần Thơ',
    center: [105.787266, 10.036205],
    bbox: [105.225759, 9.151488, 106.335165, 10.324991],
  },
  {
    id: 'haiphong',
    name: 'Hải Phòng',
    center: [106.679927, 20.862328],
    bbox: [106.124724, 20.056101, 107.815806, 21.237257],
  },
];
