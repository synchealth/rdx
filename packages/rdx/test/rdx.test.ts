import { performance } from 'perf_hooks'
import { rdxSync } from '../src/index'

const src = `---
pack: Halt 
type: ReactiveMarkdownDialog
id: test
$schema: https://schema.karla.ai/rmd
version: 1.0
---

> Halt Dialog (main body)
 
---
# introduction
Are you in a \${"pla" + "ce"} and where you can go exercise?
* [Yes](#exercise-prompt)
* [No](#halt-prompt)
 
# not understood
I didn't quite understand your response

Please answer yes or no

[LOOPBACK](#introduction)

# exercise prompt
Great!  Try getting some exercise.  Otherwise, try the HALT method.
* [I'm going to get some exercise](#exercise-prompt-success) 
    - "exercise"
* [Start HALT](#halt-hungry) 
    - "start"
    - "halt"

[CONTINUE]()

# exercise prompt success
Great, if you ever want to try HALT just say "**halt**"!

[END](#)

# halt prompt
Ok, would you like to learn the HALT method? The HALT method allows you to quickly scan your physical needs to see if they are affecting your feelings.
* [Yes](#halt-hungry)
* [No](#continue)

# halt prompt no
Ok!

[END](#)

# halt hungry

![H = Hungry](resources/halt-h.jpg)

When was the last time you ate? If it has been a while, try eating something healthy. A fruit, vegetable, or perhaps some nuts

Note: If you drank a lot of caffeine today without eating very much, you might feel jittery and anxious. A small meal will do wonders in calming your discomfort.

[PAUSE 500]()

# halt angry

![A = Angry](resources/halt-a.jpg)

If you are angry, take a time out. Remove yourself from the presence of the people or situation that is making you angry.

Take some deep breaths, and reflect on the situation that made you angry. Once you have identified the root cause of your anger, identify a request that needs to be made to remedy it.

This could be **a** personal, or interpersonal request, and we need to be willing to negotiate an outcome that works for all parties.

[PAUSE 500]()

# halt lonely

![L = Lonely](resources/halt-l.jpg)

Joining in community with others, whether that is in person or on the phone, can quickly take you out of your own thoughts and feelings.

[PAUSE 500]()

# halt tired

![T = Tired](resources/halt-t.jpg)

>Comment in markdown using callouts;  add custom cards
>using React like syntax below (remove triple quotes to actually include)

\`\`\` js live
console.log("this is live code")
\`\`\`

The best way to take a power nap is to drink a small cup of coffee, and then lie down. After 20 minutes, the caffeine will begin to metabolise in your body, and you will wake up feeling refreshed and renewed.

<MemeCard 
    src="resources/halt-t.jpg" 
    title="T = Tired"
    subtitle="Are you able to take a quick power nap"
    style={54}
/>

5-10 minutes of brisk walking, power yoga, jumping jacks, or pushups can increase circulation and produce energy!

[PAUSE 500]()

# halt wrap up dialog

Remember, you are <card>sasdadasd</card> not your feelings! Let feelings arise and fall in the body without attaching to them or identifying too strongly with them.
 
[END](#)

---

### Footnotes

Include any references or installation notes here, as well as any extra imports or exports for the embedded React code, if any`

const t0 = performance.now()
const item = rdxSync(src)
const t1 = performance.now()

console.log(item)

console.log(t1 - t0)
