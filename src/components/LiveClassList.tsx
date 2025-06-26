import React from 'react';
import LiveClassCard from './LiveClassCard';

interface Instructor {
  fullName: string;
  avatarUrl?: string;
}

interface LiveClass {
  id: string;
  title: string;
  dateTime: string;
  instructor: Instructor;
  priceStandard: number;
  priceEarlyBird: number;
  earlyBirdStart: string;
  earlyBirdEnd: string;
  remainingSeats: number;
}

interface LiveClassListProps {
  classes: LiveClass[];
  onBook?: (id: string) => void;
}

const LiveClassList: React.FC<LiveClassListProps> = ({ classes, onBook }) => {
  if (!classes.length) {
    return <div className="text-center text-gray-500 py-8">No upcoming live classes.</div>;
  }
  const now = new Date();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map(cls => {
        const earlyBirdActive =
          now >= new Date(cls.earlyBirdStart) && now <= new Date(cls.earlyBirdEnd);
        return (
          <LiveClassCard
            key={cls.id}
            id={cls.id}
            title={cls.title}
            dateTime={cls.dateTime}
            instructor={cls.instructor}
            price={cls.priceStandard}
            earlyBirdPrice={cls.priceEarlyBird}
            earlyBirdActive={earlyBirdActive}
            remainingSeats={cls.remainingSeats}
            onBook={onBook}
          />
        );
      })}
    </div>
  );
};

export default LiveClassList; 