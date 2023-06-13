# spsid-rpc

JSON-RPC connection to SPSID

## Installation

Install `spsid-rpc` with npm:

```bash
npm install spsid-rpc --save
```

## Usage
```typescript
import { SpsidRPC } from 'spsid-rpc';

const sps = new SpsidRPC('http://your_url');
sps.create_object('object', 'attr');
```
