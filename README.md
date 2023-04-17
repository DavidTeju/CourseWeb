# CourseWeb

This is an abandoned project but you may wonder,

## What is this
I strongly dislike my school's course search. It's based on an outdated search system called janzabar, is slow, has terrible UI, and is heavily
restrictive in how you can search for courses; it forces you to know exactly the course name or course code of what you're looking for 
and stifling any opportunity for course discovery. A more appropriate but, perhaps, less professional term would be "hate." And when I "hate"
things, the first thing I do is change them, and that's what I planned to do here.

I was inspired by student-created tools like [Classes.wtf](https://classes.wtf/) at Harvard and [Ten Weeks](https://tenweeks.xyz/) at Stanford,
that serve as super-fast(low-latency) natural language course search engines. A clean, simple UI to explore courses at my university.

## What happened?
I wrote two scripts in TypeScript. One to scrape all courses, and info associated with them from the school academic bulletin, the second to 
create [topic sets](https://github.com/DavidTeju/CourseWeb/blob/35223307b4e123c0618d4f45e741de1df442a101/data/courseTopicSets.json) from each
course (this was to be useful for my search rank calculation).

However, the bulletin was missing a lot of crucial information. For example, a significant number of courses had no description in the bulletin
This couldn't work since the course description is crucial to creating topic sets.

I arranged a meeting with my school's CIO and discussed this with him. While he thought it was a nice project, he let me know that given their
current responsibilities, he couldn't devote resources to sharing course data with me. Additionally, he told me that the school is already
working on transitioning to a new system. Hence, I decided to put the project on hold until the Fall.

## So why is it "abandoned?"
That's easy. It's because I will be transferring to a different university come Fall so there's little merit to picking this back up.
