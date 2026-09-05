import { useCustomCompareEffect } from '@siberiacancode/reactuse';
import { RefreshCwIcon, UserIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Demo = () => {
  const [id, setId] = useState(1);
  const [, forceRerender] = useState(0);

  const user = { id, profile: { theme: 'dark' } };

  const effectCountRef = useRef(0);
  const customCountRef = useRef(0);

  useEffect(() => {
    effectCountRef.current++;
  }, [user]);

  useCustomCompareEffect(
    () => {
      customCountRef.current++;
    },
    [user],
    ([user], [prevUser]) => user.id === prevUser.id
  );

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-4 rounded-xl p-5 shadow-sm'>
        <div className='flex items-start gap-3'>
          <div className='bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-full'>
            <UserIcon className='size-5' />
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-1 leading-tight'>
            <span className='text-foreground text-sm font-semibold'>User id: {id}</span>
            <span className='text-muted-foreground text-xs leading-relaxed'>
              The comparator only looks at <code>user.id</code>, so everything else in the object is
              ignored.
            </span>
          </div>
        </div>

        <div className='border-border grid grid-cols-2 gap-3 border-t pt-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              useEffect
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {effectCountRef.current}
            </span>
            <span className='text-muted-foreground mt-0.5 text-[10px] leading-tight'>
              runs on every render
            </span>
          </div>

          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              useCustomCompareEffect
            </span>
            <span className='text-primary font-mono text-lg font-semibold tabular-nums'>
              {customCountRef.current}
            </span>
            <span className='text-muted-foreground mt-0.5 text-[10px] leading-tight'>
              runs only when id changes
            </span>
          </div>
        </div>

        <div className='border-border flex items-center justify-end gap-2 border-t pt-3'>
          <button
            data-size='sm'
            data-variant='outline'
            type='button'
            onClick={() => forceRerender((count) => count + 1)}
          >
            <RefreshCwIcon className='size-3.5' />
            Re-render
          </button>

          <button data-size='sm' type='button' onClick={() => setId((id) => id + 1)}>
            Change id
          </button>
        </div>
      </div>
    </section>
  );
};

export default Demo;
