const NewsLetter = () => {
  return (
    <div className="my-12 md:my-16 flex flex-col items-center justify-center text-center space-y-2 px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Never Miss a Deal!</h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-500/70 pb-4 sm:pb-8">
        Subscribe to get the latest offers, new arrivals, and exclusive
        discounts
      </p>
      <form className="flex flex-col sm:flex-row items-stretch justify-between w-full max-w-2xl gap-2 sm:gap-0 h-auto sm:h-13">
        <input
          className="border border-gray-300 rounded-md sm:rounded-none rounded-r-none outline-none flex-1 px-3 py-2 sm:py-3 text-gray-500 placeholder-gray-400 text-sm sm:text-base"
          type="text"
          placeholder="Enter your email id"
          required
        />
        <button
          type="submit"
          className="px-6 sm:px-12 py-2 sm:py-3 text-white bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer rounded-md sm:rounded-none sm:rounded-r-md font-medium text-sm sm:text-base"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};
export default NewsLetter;