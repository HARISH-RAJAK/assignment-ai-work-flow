import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { CreateTaskPayload } from '../types/task';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  inputText: z.string().min(1, 'Input text is required'),
  operationType: z.enum(['uppercase', 'lowercase', 'reverse', 'word_count'] as const),
});

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskPayload) => Promise<void>;
  isLoading: boolean;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskPayload>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      inputText: '',
      operationType: 'uppercase',
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CreateTaskPayload) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden animate-modal-slide">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-zinc-950 tracking-tight">Create New Task</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              placeholder="e.g. Process Customer Survey Feedback"
              {...register('title')}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-600 transition-colors text-xs font-medium"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Operation Type
            </label>
            <select
              {...register('operationType')}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-indigo-600 transition-colors text-xs font-semibold"
            >
              <option value="uppercase">Uppercase - Convert string to uppercase</option>
              <option value="lowercase">Lowercase - Convert string to lowercase</option>
              <option value="reverse">Reverse - Reverse characters order</option>
              <option value="word_count">Word Count - Count words, chars & lines</option>
            </select>
            {errors.operationType && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.operationType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Input Text Payload
            </label>
            <textarea
              rows={4}
              placeholder="Enter text payload to process..."
              {...register('inputText')}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-600 transition-colors text-xs font-mono resize-none"
            />
            {errors.inputText && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.inputText.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
