import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType;
};
const BookingDetailsSummary = ({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
}: Props) => {
  const getNightText = (nights: number): string => {
    if (nights === 1) {
      return "noc";
    } else if (nights === 2 || nights === 3 || nights === 4) {
      return "noce";
    } else {
      return "nocy";
    }
  };

  const getAdultText = (adultCount: number): string => {
    if (adultCount == 1) {
      return "dorosły";
    } else {
      return "dorosłych";
    }
  };

  const getChildText = (childCount: number): string => {
    if (childCount === 1) {
      return "dziecko";
    } else {
      return "dzieci";
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("pl-PL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-sm font-bold">Szczegóły Twojej rezerwacji</h2>
      <div className="border-b py-2">
        Lokalizacja:
        <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
      </div>
      <div className="flex justify-between">
        <div>
          Zameldowanie
          <div className="font-bold">{formatDate(checkIn)}</div>
        </div>
        <div>
          Wymeldowanie
          <div className="font-bold">{formatDate(checkOut)}</div>
        </div>
      </div>
      <div className="border-t border-b py-2">
        Czas pobytu:
        <div className="font-bold">{`${numberOfNights} ${getNightText(
          numberOfNights
        )}`}</div>
      </div>
      <div>
        Goście
        <div className="font-bold">
          {`${adultCount} ${getAdultText(adultCount)}`} i{" "}
          {`${childCount} ${getChildText(childCount)}`}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsSummary;
