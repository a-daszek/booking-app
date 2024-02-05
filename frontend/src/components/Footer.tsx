const Footer = () => {
  return (
    <div className="bg-blue-800 py-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-col gap-2">
          <span className="text-3xl text-white font-bold">
            HolidayRooms.com
          </span>
          <span className="text-white font-bold">
            <p>
              © 2024 Anna Daszyńska - robiłam tę stronę z dużą dozą ciepła (i
              czekolady).
            </p>
          </span>
        </div>
        <span className="text-white font-bold tracking-tight flex gap-4">
          <p className="cursor-pointer">Polityka prywatności</p>
          <p className="cursor-pointer">Warunki użytkowania </p>
        </span>
      </div>
    </div>
  );
};

export default Footer;
