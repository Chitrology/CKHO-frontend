import React from 'react';

interface LiveClassCardProps {
  id: string;
  title: string;
  dateTime: string;
  instructor: { fullName: string; avatarUrl?: string };
  price: number;
  earlyBirdPrice?: number;
  earlyBirdActive?: boolean;
  remainingSeats: number;
  onBook?: (id: string) => void;
}

const LiveClassCard: React.FC<LiveClassCardProps> = ({
  id,
  title,
  dateTime,
  instructor,
  price,
  earlyBirdPrice,
  earlyBirdActive,
  remainingSeats,
  onBook,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border hover:shadow-lg transition">
      <div className="flex items-center gap-3">
        {instructor.avatarUrl && (
          <img src={instructor.avatarUrl} alt={instructor.fullName} className="w-10 h-10 rounded-full" />
        )}
        <div>
          <div className="font-semibold text-lg">{title}</div>
          <div className="text-sm text-gray-500">By {instructor.fullName}</div>
        </div>
      </div>
      <div className="text-sm text-gray-700 mt-2">
        <span className="font-medium">Date:</span> {new Date(dateTime).toLocaleString()}
      </div>
      <div className="text-sm text-gray-700">
        <span className="font-medium">Seats left:</span> {remainingSeats}
      </div>
      <div className="text-sm text-gray-700">
        <span className="font-medium">Price:</span>{' '}
        {earlyBirdActive && earlyBirdPrice ? (
          <>
            <span className="text-green-600 font-bold">₹{(earlyBirdPrice / 100).toFixed(0)}</span>
            <span className="line-through text-gray-400 ml-2">₹{(price / 100).toFixed(0)}</span>
            <span className="ml-2 text-xs text-green-700">Early Bird</span>
          </>
        ) : (
          <span className="font-bold">₹{(price / 100).toFixed(0)}</span>
        )}
      </div>
      <button
        className="mt-2 bg-primary text-white rounded px-4 py-2 font-semibold disabled:opacity-50"
        disabled={remainingSeats <= 0}
        onClick={() => onBook && onBook(id)}
      >
        {remainingSeats > 0 ? 'Book Now' : 'Full'}
      </button>
    </div>
  );
};

export default LiveClassCard; 