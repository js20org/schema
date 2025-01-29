# @js20/schema

Schema validation for frontend or backend.
E.g.

```ts
//Type definition for typescript compiler
interface User {
  id: number;
  name: string;
  email?: string;
  age?: number;
}

//Runtime definition
const sUser: User = {
    id: sNumber().type(),
    name: sString().type(),
    email: sString().optional().type(),
    age: sNumber().optional().type()
};

//Validated schema
const validatedSchema = getValidatedSchema(sUser);

//This throws
validateBySchema(validatedSchema, {
    something: false
});

//This is ok
validateBySchema(validatedSchema, {
    id: 1,
    name: "John"
});
```

## License

MIT license
