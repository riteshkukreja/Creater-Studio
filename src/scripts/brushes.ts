import { RoundBrush, SquareBrush, ClearBrush } from '../components/Brush';
import { BrushLoaderModule } from '../ui/loaders/BrushLoader';

/** Load Brushes */
BrushLoaderModule.addBrush(RoundBrush);
BrushLoaderModule.addBrush(SquareBrush);
BrushLoaderModule.addBrush(ClearBrush);