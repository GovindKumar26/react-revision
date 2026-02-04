// React Hook Form - Complete Examples
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ========================================
// 1. BASIC FORM
// ========================================

function BasicForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <h3>Basic Form</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register('firstName', { required: 'First name is required' })}
            placeholder="First Name"
          />
          {errors.firstName && <span style={{ color: 'red' }}>{errors.firstName.message}</span>}
        </div>

        <div>
          <input
            {...register('lastName', { required: 'Last name is required' })}
            placeholder="Last Name"
          />
          {errors.lastName && <span style={{ color: 'red' }}>{errors.lastName.message}</span>}
        </div>

        <div>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="Email"
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

// ========================================
// 2. FORM WITH VALIDATION RULES
// ========================================

function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const onSubmit = (data) => {
    console.log('Signup data:', data);
  };

  return (
    <div>
      <h3>Signup Form with Validation</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Min 3 characters' },
              maxLength: { value: 20, message: 'Max 20 characters' }
            })}
            placeholder="Username"
          />
          {errors.username && <span style={{ color: 'red' }}>{errors.username.message}</span>}
        </div>

        <div>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Min 6 characters' },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)/,
                message: 'Must contain letter and number'
              }
            })}
            placeholder="Password"
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
        </div>

        <div>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: value => value === password || 'Passwords do not match'
            })}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword.message}</span>}
        </div>

        <div>
          <input
            type="number"
            {...register('age', {
              required: 'Age is required',
              min: { value: 18, message: 'Must be 18+' },
              max: { value: 120, message: 'Must be under 120' }
            })}
            placeholder="Age"
          />
          {errors.age && <span style={{ color: 'red' }}>{errors.age.message}</span>}
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              {...register('termsAccepted', {
                required: 'You must accept terms'
              })}
            />
            I accept the terms and conditions
          </label>
          {errors.termsAccepted && <span style={{ color: 'red' }}>{errors.termsAccepted.message}</span>}
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

// ========================================
// 3. ZOD SCHEMA VALIDATION
// ========================================

const userSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3, 'Min 3 characters').max(20, 'Max 20 characters'),
  age: z.number().min(18, 'Must be 18+').max(120, 'Must be under 120'),
  password: z.string().min(6, 'Min 6 characters').regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Must contain letter and number'),
  website: z.string().url('Invalid URL').optional().or(z.literal(''))
});

function ZodValidationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(userSchema)
  });

  const onSubmit = (data) => {
    console.log('Zod validated data:', data);
    alert('Form submitted successfully!');
    reset();
  };

  return (
    <div>
      <h3>Zod Schema Validation</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input {...register('email')} placeholder="Email" />
          {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
        </div>

        <div>
          <input {...register('username')} placeholder="Username" />
          {errors.username && <span style={{ color: 'red' }}>{errors.username.message}</span>}
        </div>

        <div>
          <input
            type="number"
            {...register('age', { valueAsNumber: true })}
            placeholder="Age"
          />
          {errors.age && <span style={{ color: 'red' }}>{errors.age.message}</span>}
        </div>

        <div>
          <input type="password" {...register('password')} placeholder="Password" />
          {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
        </div>

        <div>
          <input {...register('website')} placeholder="Website (optional)" />
          {errors.website && <span style={{ color: 'red' }}>{errors.website.message}</span>}
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={() => reset()}>Reset</button>
      </form>
    </div>
  );
}

// ========================================
// 4. CONTROLLED COMPONENTS WITH CONTROLLER
// ========================================

function ControlledForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      category: '',
      rating: 3,
      agreed: false
    }
  });

  const onSubmit = (data) => {
    console.log('Controlled form data:', data);
  };

  return (
    <div>
      <h3>Controlled Components with Controller</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Category:</label>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field, fieldState }) => (
              <>
                <select {...field}>
                  <option value="">Select...</option>
                  <option value="tech">Technology</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                </select>
                {fieldState.error && <span style={{ color: 'red' }}>{fieldState.error.message}</span>}
              </>
            )}
          />
        </div>

        <div>
          <label>Rating:</label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <input type="range" min="1" max="5" {...field} />
            )}
          />
          <span>Value: {control._formValues.rating}</span>
        </div>

        <div>
          <Controller
            name="agreed"
            control={control}
            rules={{ required: 'You must agree' }}
            render={({ field, fieldState }) => (
              <>
                <label>
                  <input type="checkbox" {...field} value="" checked={field.value} />
                  I agree to the terms
                </label>
                {fieldState.error && <span style={{ color: 'red' }}>{fieldState.error.message}</span>}
              </>
            )}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

// ========================================
// 5. DYNAMIC FORM FIELDS
// ========================================

function DynamicForm() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      tasks: [{ title: '', priority: 'low' }]
    }
  });

  const tasks = watch('tasks');

  const onSubmit = (data) => {
    console.log('Dynamic form data:', data);
  };

  return (
    <div>
      <h3>Dynamic Form Fields</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {tasks.map((_, index) => (
          <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <input
              {...register(`tasks.${index}.title`)}
              placeholder="Task title"
            />
            <select {...register(`tasks.${index}.priority`)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

// ========================================
// 6. FORM WITH RESET AND DEFAULT VALUES
// ========================================

function FormWithReset() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting }
  } = useForm({
    defaultValues: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  });

  const onSubmit = (data) => {
    console.log('Submitted:', data);
    // Simulate async submission
    setTimeout(() => {
      alert('Submitted!');
      reset(); // Reset to default values
    }, 1000);
  };

  return (
    <div>
      <h3>Form with Reset</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input {...register('name')} placeholder="Name" />
        </div>
        <div>
          <input {...register('email')} placeholder="Email" />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" onClick={() => reset()} disabled={!isDirty}>
          Reset to Default
        </button>
      </form>
    </div>
  );
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function ReactHookFormExamples() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Hook Form Examples</h1>
      
      <section>
        <h2>1. Basic Form</h2>
        <BasicForm />
      </section>
      
      <section>
        <h2>2. Form with Validation Rules</h2>
        <SignupForm />
      </section>
      
      <section>
        <h2>3. Zod Schema Validation</h2>
        <ZodValidationForm />
      </section>
      
      <section>
        <h2>4. Controlled Components</h2>
        <ControlledForm />
      </section>
      
      <section>
        <h2>5. Dynamic Form Fields</h2>
        <DynamicForm />
      </section>
      
      <section>
        <h2>6. Form with Reset</h2>
        <FormWithReset />
      </section>
    </div>
  );
}

/* 
INSTALLATION:
npm install react-hook-form zod @hookform/resolvers
*/
