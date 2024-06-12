import React, { useState } from 'react';
import { Slider } from './slider';
import { Button } from './button';
import { useToast } from '@/components/ui/use-toast';

const ReviewForm = ({ restaurantId }: { restaurantId: number }) => {
  const { toast } = useToast();
  const [rating, setRating] = useState([2]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/reviews/${restaurantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: rating[0] }),
      });

      if (!res.ok) {
        toast({
          title: 'Error',
          description: 'Failed to submit review',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Review submitted successfully!',
          variant: 'default',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getLabel = (value: number) => {
    if (value <= 3) return { text: 'Tiny Taco Tragedy', color: 'text-red-500' };
    if (value <= 6) return { text: 'Burrito Blunder', color: 'text-yellow-500' };
    if (value <= 8) return { text: 'Quesadilla Quality', color: 'text-blue-500' };
    return { text: 'Guacamole Greatness', color: 'text-green-500' };
  };

  const label = getLabel(rating[0]);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div>
        <div className={`mt-4 ${label.color}`}>{`${label.text} (${rating[0]})`}</div>
        <Slider
          className="mt-4"
          min={0}
          defaultValue={[rating[0]]}
          max={10}
          step={1}
          onValueChange={(value) => setRating(value)}
          style={{ width: '100%', marginTop: '10px' }}
        />
      </div>
      <Button type="submit" className="mt-6 w-full" style={{ width: '100%', marginTop: '10px' }}>
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;
